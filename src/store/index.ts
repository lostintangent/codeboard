import { observable } from "mobx";

interface BoardCard {
  id: string;
  note: string;
}

interface BoardColumn {
  id: string;
  title: string;
  cards: BoardCard[];
}

interface Board {
  id: string;
  title: string;
  lanes: BoardColumn[];
}

interface Store {
  isSignedIn: boolean;
  board: Board | undefined;
}

export const store: Store = observable({
  isSignedIn: false,
  board: undefined,
});
