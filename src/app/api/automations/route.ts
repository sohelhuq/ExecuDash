
import { NextResponse } from 'next/server';

// This is your secret key. It should match the one you set in your automation platform (Make/Zapier).
// For better security, this should be stored in an environment variable.
const AUTOMATION_SECRET = process.env.AUTOMATION_SECRET_KEY || 'automations-secret-B8gK3sL9zP7vR2wX';

export async function POST(request: Request) {
  try {
    const authorizationHeader = request.headers.get('Authorization');

    // 1. Check for the secret key in the Authorization header
    if (authorizationHeader !== `Bearer ${AUTOMATION_SECRET}`) {
      console.warn('Unauthorized access attempt to automation webhook.');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the incoming data from the webhook
    const payload = await request.json();

    console.log('Received payload from automation:', payload);

    // 3. Process the payload
    // Here you can add your logic based on the payload.
    // For example, you could save the data to Firestore, send a notification, etc.
    //
    // Example:
    // if (payload.event === 'new_lead') {
    //   // Save to Firestore
    // }

    // Respond with a success message
    return NextResponse.json({ message: 'Webhook received successfully', receivedData: payload }, { status: 200 });

  } catch (error) {
    console.error('Error processing automation webhook:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Error processing request', error: errorMessage }, { status: 500 });
  }
}
