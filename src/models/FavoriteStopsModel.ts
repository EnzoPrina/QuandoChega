type Stop = {
    id: number;
    name: string;
  };
  
  class FavoriteStopsModel {
    private static favorites: Stop[] = [];
  
    // Obtener todas las paradas favoritas
    static getFavorites(): Stop[] {
      return this.favorites;
    }
  
    // Agregar una parada a favoritos
    static addFavorite(stop: Stop): void {
      if (!this.favorites.some((fav) => fav.id === stop.id)) {
        this.favorites.push(stop);
      }
    }
  
    // Eliminar una parada de favoritos
    static removeFavorite(stopId: number): void {
      this.favorites = this.favorites.filter((fav) => fav.id !== stopId);
    }
  }
  
  export default FavoriteStopsModel;
  