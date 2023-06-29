import { redirect } from '@sveltejs/kit';

export const load = ({ params }) => {
  const { tableUrl, id } = params;
  throw redirect(303, `/process/${tableUrl}/${id}/view`);
};
