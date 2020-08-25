import { observable } from "mobx";

interface BoardCard {
  contents: string;
}

interface BoardColumn {
  cards: BoardCard[];
}

interface Board {
  title: string;
  columns: BoardColumn[];
}

interface Store {
  isSignedIn: boolean;
  boards: Board[];
}

export const store: Store = observable({
  isSignedIn: false,
  boards: [],
});
