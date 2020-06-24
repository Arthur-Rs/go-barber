import { parseISO, getDate, getHours } from 'date-fns';
import Email from '../../lib/mail';

class CancellationEmail {
  get key() {
    return 'CancellationEmail';
  }

  async handle({ data }) {
    const { appoint } = data;
    const date = parseISO(appoint.date);

    await Email.sendMail({
      to: `${appoint.name} <${appoint.email}>`,
      subject: 'Cancelamento de Agendamento',
      template: 'cancellation',
      context: {
        provider: appoint.name,
        user: appoint.user.name,
        date: getDate(date),
        hour: getHours(date),
      },
    });
  }
}

export default new CancellationEmail();
