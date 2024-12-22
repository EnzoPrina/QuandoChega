// viewmodels/HomeViewModel.ts
import Linea from '../models/Linea';
import Parada from '../models/Parada';

const HomeViewModel = {
  getLineas(): Linea[] {
    return [
      {
        id: 1,
        name: 'Línea Verde',
        color: '#00FF00',
        paradas: [
          { id: 1, name: 'Estação Rodoviária', order: 1 },
          { id: 2, name: 'Praça Camões', order: 2 },
          { id: 3, name: 'Hospital', order: 3 },
        ],
      },
      {
        id: 2,
        name: 'Línea Amarilla',
        color: '#FFD700',
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
