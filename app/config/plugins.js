module.exports = ({ env }) => ({
  email: {
    provider: "mailgun",
    providerOptions: {
      apiKey: 'not-th-key'
    },
    settings: {
      defaultFrom: "no-responder@medica-uruguaya.com.uy",
      defaultReplyTo: "no-responder@medica-uruguaya.com.uy"
    }
  }
});
