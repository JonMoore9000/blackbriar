import { NextRequest, NextResponse } from 'next/server';
import { Comment, CommentSubmissionForm } from '@/types';
import { saveComment, getCommentsByRunId, getRunById } from '@/lib/kvStorage';
import { generateId } from '@/lib/storage';
import { validateComment } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: runId } = await params;
    
    // Verify the run exists
    const run = await getRunById(runId);
    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }
    
    const body: CommentSubmissionForm = await request.json();
    
    // Validate the comment
    const errors = validateComment(body.message, body.authorName);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    
    // Create the comment object
    const comment: Comment = {
      id: generateId(),
      runId: runId,
      createdAt: new Date().toISOString(),
      authorName: body.authorName || undefined,
      message: body.message.trim()
    };
    
    // Save the comment
    await saveComment(comment);
    
    return NextResponse.json({ 
      success: true, 
      comment,
      message: 'Comment posted successfully' 
    });
    
  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: runId } = await params;
    
    // Verify the run exists
    const run = await getRunById(runId);
    if (!run) {
      return NextResponse.json(
        { error: 'Run not found' },
        { status: 404 }
      );
    }
    
    const comments = await getCommentsByRunId(runId);
    
    return NextResponse.json({
      success: true,
      comments,
      total: comments.length
    });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
