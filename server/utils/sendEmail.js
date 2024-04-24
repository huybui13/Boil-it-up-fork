import { createTransport } from "nodemailer";

export default async (email, subject, text) => {
	try {
		const transporter = createTransport({
			//host: 'smtp.gmail.com',
			//service: process.env.SERVICE,
			//port: Number(process.env.EMAIL_PORT),
			//secure: Boolean(process.env.SECURE),
			service: "Gmail",
			auth: {
				user: "purdueboilitup@gmail.com",
				pass: "rgedwjobigdufalp",
			},
		});

		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			text: text,
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!");
		console.log(error);
		return error;
	}
};
