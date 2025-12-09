import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate random 6 digit OTP
export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP mail
export const sendOtpMail = async (email, otp) => {
  const mailOptions = {
    from: `StockMaster <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset - StockMaster",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #F5E6D3;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #997644 0%, #8B6F47 100%);
          padding: 40px 30px;
          text-align: center;
          position: relative;
        }
        .header::before {
          content: '';
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        .logo {
          width: 80px;
          height: 80px;
          background-color: #D4AF37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 36px;
          font-weight: bold;
          color: #997644;
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .header h1 {
          color: white;
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }
        .content {
          padding: 40px 30px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
          font-weight: 600;
        }
        .message {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .otp-container {
          background: linear-gradient(135deg, #F5E6D3 0%, #E8D4B8 100%);
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          border: 2px dashed #D4AF37;
        }
        .otp-label {
          font-size: 13px;
          color: #997644;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }
        .otp-code {
          font-size: 42px;
          font-weight: bold;
          color: #997644;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
          background: white;
          padding: 15px 30px;
          border-radius: 8px;
          display: inline-block;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .validity {
          font-size: 13px;
          color: #ef4444;
          margin-top: 15px;
          font-weight: 600;
        }
        .warning {
          background-color: #FEF3C7;
          border-left: 4px solid #F59E0B;
          padding: 16px 20px;
          border-radius: 8px;
          margin: 20px 0;
          font-size: 14px;
          color: #92400E;
        }
        .footer {
          background-color: #F9FAFB;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #E5E7EB;
        }
        .footer-text {
          font-size: 13px;
          color: #6B7280;
          margin: 5px 0;
        }
        .brand {
          color: #997644;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">SM</div>
          <h1>StockMaster</h1>
        </div>
        
        <div class="content">
          <div class="greeting">Password Reset Request</div>
          
          <div class="message">
            We received a request to reset your password for your StockMaster account. 
            Use the verification code below to complete the password reset process.
          </div>
          
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="validity">⏰ Valid for 10 minutes only</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, 
            please ignore this email and ensure your account is secure.
          </div>
          
          <div class="message">
            Need help? Contact our support team at any time.
          </div>
        </div>
        
        <div class="footer">
          <div class="brand">StockMaster</div>
          <div class="footer-text">Inventory Management System</div>
          <div class="footer-text" style="margin-top: 12px;">
            © ${new Date().getFullYear()} StockMaster. All rights reserved.
          </div>
        </div>
      </div>
    </body>
    </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", email);
    return true;
  } catch (err) {
    console.error("Error sending OTP:", err);
    return false;
  }
};
