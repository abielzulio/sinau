export type Maybe<T> = T | undefined;

export type Module = {
  title: string;
  overview: string;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type Nullable<T> = T | null;

export type ValueAndSet<T> = {
  value: T;
  set: SetState<T>;
}
