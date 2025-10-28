'use client';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, CheckCircle } from 'lucide-react';

const steps = [
    {
        title: "Step 1: Choose Your Trigger",
        description: "Start by creating a new automation (a 'Scenario' in Make.com or a 'Zap' in Zapier). For the trigger, select the app and event that will start your workflow. For example, 'New Row in Google Sheets' or 'New Email in Gmail'."
    },
    {
        title: "Step 2: Add a Webhook Action",
        description: "For the next step, add an action module. Search for 'Webhook' or 'HTTP' and choose the action to make a custom web request (e.g., 'Make a request' in Zapier or 'Make an API call' in Make.com)."
    },
    {
        title: "Step 3: Configure the Webhook",
        description: "Now, you'll need to configure the request. Fill in the following fields:",
        details: [
            {
                label: "URL",
                value: "https://<your-app-domain>/api/automations",
                description: "Paste this URL into the URL field. Replace `<your-app-domain>` with your application's actual domain name when it's live."
            },
            {
                label: "Method",
                value: "POST",
                description: "Select POST as the request method to send data to your application."
            },
            {
                label: "Headers",
                value: "Key: Authorization, Value: Bearer automations-secret-B8gK3sL9zP7vR2wX",
                description: "Add a header to securely authenticate your request. The value must start with 'Bearer ' followed by your secret key."
            },
            {
                label: "Body Type",
                value: "JSON",
                description: "Select 'raw' or 'JSON' as the body type."
            },
            {
                label: "Body Content",
                value: '{\n  "event": "new_lead",\n  "data": {\n    "name": "[Mapped from Trigger]"\n  }\n}',
                description: "This is where you define the data you want to send. Map fields from your trigger step into this JSON structure."
            }
        ]
    },
    {
        title: "Step 4: Test and Activate",
        description: "Send a test request from your automation platform. If successful, your application's server console will log the received payload. Once confirmed, you can activate your automation!"
    }
];

export default function AutomationsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Future Automations & Webhooks</h1>
          <p className="text-muted-foreground">A guide to connecting external services like Make.com or Zapier.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>What is a Webhook?</CardTitle>
                <CardDescription>
                    A webhook is like a special phone number for your application. Other services can call this number to send real-time information. We created an API endpoint at <Badge variant="outline">/api/automations</Badge> that acts as this 'phone number'.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    You can use this to automate tasks, such as creating a new customer in your app whenever you get a new lead in your CRM, or logging a transaction when a payment is processed.
                </p>
            </CardContent>
        </Card>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">{index + 1}</div>
                    <CardTitle>{step.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pl-16 space-y-4">
                <p className="text-muted-foreground">{step.description}</p>
                {step.details && (
                  <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <p className="font-semibold">{detail.label}:</p>
                        {detail.label === 'Body Content' ? (
                            <pre className="p-3 rounded-md bg-background text-sm"><code>{detail.value}</code></pre>
                        ) : (
                            <Badge variant="secondary" className="max-w-fit">{detail.value}</Badge>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{detail.description}</p>
                      </div>  
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
