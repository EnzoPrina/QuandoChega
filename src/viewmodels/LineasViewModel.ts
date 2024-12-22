// viewmodels/LineasViewModel.ts
import Linea from '../models/Linea';
import HomeViewModel from './HomeViewModel';

const LineasViewModel = {
  getParadasPorLinea(lineaId: number) {
    const lineas = HomeViewModel.getLineas();
    return lineas.find((linea) => linea.id === lineaId)?.paradas || [];
  },
};

export default LineasViewModel;
