import { $Path } from './$';

export default interface Chain<Badge extends string> {
  name: string;
  watches: any[];
  data: any;
  effects: {
    invalidates: boolean;
    badges: Badge[];
    errors: { [badge in Badge]?: string };
    $: {
      path: $Path;
      value: any;
    }[];
  };
}
