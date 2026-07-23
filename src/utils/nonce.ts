let nonce: string | undefined;

export const getNonce = (): string | undefined => nonce;

export const setNonce = (hash: string): void => {
  nonce = hash;
};
