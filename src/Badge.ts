export type Message = string;
export type Badge<K extends string> = K | { readonly badge: K; readonly message: Message };
