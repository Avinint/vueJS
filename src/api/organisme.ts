export async function getOrganismes(client_id: number): Promise<Organisme[]> {

	// TODO: Call WS /api/creneau/client/{clientId}/organismes to retreive data from the API

  return [
    {
      id: 1,
      libelle: 'Organisme 1',
    },
    {
      id: 2,
      libelle: 'Organisme 2',
    },
    {
      id: 3,
      libelle: 'Organisme 3',
    },
    {
      id: 4,
      libelle: 'Organisme 4',
    },
  ]
}