// viewmodels/HomeViewModel.ts
import Linea from '../models/Linea';
import Parada from '../models/Parada';

const HomeViewModel = {
  getLineas(): Linea[] {
    return [
      {
        id: 1,
        name: 'U1',
        color: '#118a37',
        paradas: [
          { id: 1, name: 'Estação Rodoviária', order: 1 },
          { id: 2, name: 'Praça Camões', order: 2 },
          { id: 3, name: 'Hospital', order: 3 },
        ],
      },
      {
        id: 2,
        name: 'U2',
        color: '#ffbf40',
        paradas: [
          { id: 1, name: 'Avenida Central', order: 1 },
          { id: 2, name: 'Mercado Municipal', order: 2 },
          { id: 3, name: 'Universidad', order: 3 },
        ],
      },
      {
        id: 3,
        name: 'U3',
        color: '#d6130c',
        paradas: [
          { id: 1, name: 'Avenida Central', order: 1 },
          { id: 2, name: 'Mercado Municipal', order: 2 },
          { id: 3, name: 'Universidad', order: 3 },
        ],
      },
    ];
  },
};

export default HomeViewModel;
