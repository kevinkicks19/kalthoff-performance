import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, service, message } = data;

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kalthoffperformance@gmail.com',
        // You'll need to set this up as an App Password in your Google Account
        pass: import.meta.env.EMAIL_PASSWORD
      }
    });

    // Email content
    const mailOptions = {
      from: 'kalthoffperformance@gmail.com',
      to: 'kalthoffperformance@gmail.com',
      subject: `New Contact Form Submission - ${service}`,
      text: `
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}
      `,
      html: `
<h2>New Contact Form Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Service:</strong> ${service}</p>
<h3>Message:</h3>
<p>${message}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({
      message: 'Email sent successfully'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(JSON.stringify({
      message: 'Error sending email'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 