import { RequestHandler } from "express";
import nodemailer from "nodemailer";
import crypto from "crypto";

const getEmailTransporter = () => {
  if (process.env.HOSTINGER_EMAIL && process.env.HOSTINGER_PASSWORD) {
    return nodemailer.createTransport({
      host: process.env.HOSTINGER_SMTP || "smtp.hostinger.com",
      port: parseInt(process.env.HOSTINGER_PORT || "465"),
      secure: process.env.HOSTINGER_PORT === "465",
      auth: {
        user: process.env.HOSTINGER_EMAIL,
        pass: process.env.HOSTINGER_PASSWORD,
      },
    });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_PASSWORD) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "test@ethereal.email",
      pass: "test123456",
    },
  });
};

export const placeOrder: RequestHandler = async (req, res) => {
  try {
    const {
      fullName,
      email,
      workEmail,
      phone,
      company,
      delivery,
      requirements,
      payment,
      items,
      total,
    } = req.body;

    if (!email || !workEmail || !phone) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const orderId = crypto.randomBytes(8).toString("hex").toUpperCase();
    const orderDate = new Date().toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const itemsList = items
      .map(
        (item: any) =>
          `<tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0; text-align: left;">${item.product.name}</td>
        <td style="padding: 12px 0; text-align: center;">${item.entry.qty} kg</td>
        <td style="padding: 12px 0; text-align: right;">₹${item.product.price.toLocaleString("en-IN")}</td>
        <td style="padding: 12px 0; text-align: right;"><strong>₹${(
          item.product.price * item.entry.qty
        ).toLocaleString("en-IN")}</strong></td>
      </tr>`
      )
      .join("");

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a3d2a; color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; font-size: 28px;">Earth Root Agro</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Order Confirmation</p>
        </div>

        <div style="background-color: #f9f7f4; padding: 30px; border-radius: 0 0 12px 12px;">
          <p style="margin: 0 0 20px 0; color: #333;">Dear ${fullName},</p>

          <p style="margin: 0 0 20px 0; color: #666; line-height: 1.6;">
            Thank you for your order! We've received your requirement and our sourcing team will be in touch shortly to confirm the final quote and delivery details.
          </p>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #1a3d2a;">Order Summary</p>
            <p style="margin: 5px 0; color: #666;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Order Date:</strong> ${orderDate}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Delivery Location:</strong> ${delivery}</p>
          </div>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #1a3d2a;">Order Details</p>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f0f0f0;">
                  <th style="padding: 12px 0; text-align: left; font-weight: bold;">Product</th>
                  <th style="padding: 12px 0; text-align: center; font-weight: bold;">Qty</th>
                  <th style="padding: 12px 0; text-align: right; font-weight: bold;">Unit Price</th>
                  <th style="padding: 12px 0; text-align: right; font-weight: bold;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsList}
              </tbody>
            </table>
            <div style="border-top: 2px solid #1a3d2a; margin-top: 15px; padding-top: 15px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #d4a574;">
                <span>Total (Indicative):</span>
                <span>₹${total.toLocaleString("en-IN")}</span>
              </div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">*Final price will be confirmed by our team before payment</p>
            </div>
          </div>

          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 15px 0; font-weight: bold; color: #1a3d2a;">Your Details</p>
            <p style="margin: 5px 0; color: #666;"><strong>Name:</strong> ${fullName}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Work Email:</strong> ${workEmail}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Phone:</strong> ${phone}</p>
            ${company ? `<p style="margin: 5px 0; color: #666;"><strong>Company:</strong> ${company}</p>` : ""}
            ${requirements ? `<p style="margin: 5px 0; color: #666;"><strong>Requirements:</strong> ${requirements}</p>` : ""}
            <p style="margin: 5px 0; color: #666;"><strong>Payment Method:</strong> ${payment === "cod" ? "Cash on Delivery" : payment === "upi" ? "UPI" : "Net Banking"}</p>
          </div>

          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574;">
            <p style="margin: 0; color: #8b5a00; font-size: 14px;">
              <strong>Next Steps:</strong> Our sourcing team will review your requirement and contact you at ${workEmail} or ${phone} within one business day to confirm the final price and delivery timeline.
            </p>
          </div>

          <p style="margin: 20px 0 0 0; color: #666; font-size: 12px; line-height: 1.6;">
            If you have any questions, please contact us at <a href="mailto:support@earthrootagro.shop" style="color: #1a3d2a; text-decoration: none;">support@earthrootagro.shop</a> or call <a href="tel:+919619631768" style="color: #1a3d2a; text-decoration: none;">+91 96196 31768</a>
          </p>

          <p style="margin: 15px 0 0 0; color: #999; font-size: 12px; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
            © 2025 Earth Root Agro · Mumbai, Maharashtra
          </p>
        </div>
      </div>
    `;

    const transporter = getEmailTransporter();

    await transporter.sendMail({
      from: process.env.HOSTINGER_EMAIL || process.env.GMAIL_USER || "support@earthrootagro.shop",
      to: workEmail,
      cc: email,
      subject: `Order Confirmation #${orderId} - Earth Root Agro`,
      html: emailHtml,
    });

    console.log(`✅ Order confirmation email sent to ${workEmail} (Order ID: ${orderId})`);

    res.status(201).json({
      message: "Order placed successfully",
      orderId,
      email: workEmail,
    });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
};
