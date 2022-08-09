type Foo2 = {
  propA: number;
  propB: boolean;
  propC: string;
}

type PropTypeUnion = Foo2[keyof Foo2]; // string | number | boolean