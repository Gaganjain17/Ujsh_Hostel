/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================================
// UJSH Hostel Website - Supabase Edge Function to Send Approval Email
// Deploy using Supabase CLI: supabase functions deploy send-approval-email
// Set your Resend API Key in Supabase Dashboard > Settings > Edge Functions:
// RESEND_API_KEY = your_resend_api_key
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { to, fullName, applicationNo, studyCourse, studentType } = await req.json();

    if (!to || !fullName || !applicationNo) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY is not configured in Supabase environment variables.");
      return new Response(JSON.stringify({ error: "Email provider API key is not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Professional HTML Approval Email Template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>UJSH Sion Hostel Admission Approved</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f5f7;
            margin: 0;
            padding: 0;
            color: #333333;
          }
          .email-wrapper {
            width: 100%;
            background-color: #f4f5f7;
            padding: 30px 0;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            border: 1px solid #e1e4e8;
          }
          .email-header {
            background-color: #0f172a;
            color: #ffffff;
            padding: 30px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 0.5px;
          }
          .email-header p {
            margin: 5px 0 0 0;
            font-size: 12px;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }
          .email-body {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #0f172a;
          }
          .lead-text {
            font-size: 15px;
            line-height: 1.6;
            margin-bottom: 25px;
            color: #4b5563;
          }
          .details-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 30px;
          }
          .details-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 14px;
          }
          .details-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .details-label {
            font-weight: bold;
            color: #64748b;
          }
          .details-value {
            font-weight: bold;
            color: #0f172a;
          }
          .section-title {
            font-size: 15px;
            font-weight: bold;
            color: #0f172a;
            margin-top: 25px;
            margin-bottom: 15px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 5px;
            display: inline-block;
          }
          .steps-list {
            padding-left: 20px;
            margin: 0 0 25px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #4b5563;
          }
          .steps-list li {
            margin-bottom: 10px;
          }
          .email-footer {
            background-color: #f8fafc;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
          }
          .email-footer p {
            margin: 5px 0;
          }
          .btn-group {
            text-align: center;
            margin-top: 30px;
          }
          .btn {
            display: inline-block;
            background-color: #3b82f6;
            color: #ffffff !important;
            padding: 12px 25px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <div class="email-header">
              <h1>UNITED JAIN STUDENTS HOME</h1>
              <p>Estd. 1919 | Sion, Mumbai</p>
            </div>
            
            <div class="email-body">
              <div class="greeting">Dear ${fullName},</div>
              <p class="lead-text">
                Congratulations! We are delighted to inform you that your application for admission at <strong>United Jain Students Home (UJSH) Sion, Mumbai</strong> has been officially <strong>APPROVED</strong> by the Managing Committee.
              </p>
              
              <div class="details-card">
                <div class="details-row">
                  <span class="details-label">Digital Application No:</span>
                  <span class="details-value" style="color: #3b82f6;">#UJSH-${applicationNo}</span>
                </div>
                <div className="details-row">
                  <span class="details-label">Study Course/Stream:</span>
                  <span class="details-value">${studyCourse}</span>
                </div>
                <div class="details-row">
                  <span class="details-label">Student Type:</span>
                  <span class="details-value" style="text-transform: uppercase;">${studentType} Student</span>
                </div>
                <div class="details-row">
                  <span class="details-label">Allotment Date:</span>
                  <span class="details-value">${new Date().toLocaleDateString("en-IN")}</span>
                </div>
              </div>
              
              <div class="section-title">Next Steps to Secure Admission:</div>
              <ol class="steps-list">
                <li><strong>Verify Documents:</strong> Bring original physical copies of all your uploaded documents (Jain Community Certificate, Last 2 Exams Marksheets, and Guardian ID Proof) for office verification.</li>
                <li><strong>Photographs:</strong> Submit 2 physical passport-size photographs at the hostel desk for your physical hostel ID card.</li>
                <li><strong>Fee Payment:</strong> Visit the Sion office within 5 working days to complete your Term Fee payment and finalize your room assignment.</li>
              </ol>

              <p class="lead-text" style="margin-bottom: 0;">
                We look forward to welcoming you into our supportive, academic-oriented community!
              </p>
            </div>
            
            <div class="email-footer">
              <p><strong>United Jain Students Home</strong></p>
              <p>Plot No 64, C.U Shah Bhawan, Sion (West), Mumbai-400 022.</p>
              <p>Office Phone: 022-2408 0100 | Admission Helpline: +91 82918 29191</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Dispatch to Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "UJSH Hostel Admissions <admissions@resend.dev>", // Or your custom sender domain
        to: [to],
        subject: `🎉 Hostel Admission Approved - Application #UJSH-${applicationNo}`,
        html: htmlContent,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to dispatch email via Resend");
    }

    return new Response(JSON.stringify({ success: true, messageId: result.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (err: any) {
    console.error("Error in send-approval-email Edge Function:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
