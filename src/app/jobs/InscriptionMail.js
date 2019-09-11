import Mail from '../../lib/Mail';

class InscriptionMail {
  get key() {
    return 'InscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Novo inscrito',
      template: 'inscription',
      context: {
        name: meetup.user.name,
        name_inscription: user.name,
        meetup: meetup.title,
      },
    });
  }
}

export default new InscriptionMail();
