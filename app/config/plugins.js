module.exports = ({ env }) => ({
  email: {
    provider: "mailgun",
    providerOptions: {
      apiKey: env("MAILGUN_KEY")
    },
    settings: {
      defaultFrom: "no-responder@medica-uruguaya.com.uy",
      defaultReplyTo: "no-responder@medica-uruguaya.com.uy"
    }
  }
});
