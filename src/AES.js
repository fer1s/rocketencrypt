const salt = new Uint8Array([
  48, 57, 102, 49, 97, 56, 98, 100, 45, 99, 99, 100, 57, 45, 52, 57, 56, 51, 45,
  56, 100, 97, 102, 45, 100, 100, 98, 102, 98, 52, 54, 101, 51, 51, 101, 51,
]); // Salt was generated from random uuid (including "-")
export default {
  encrypt: async (data, key) => {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    return new Uint8Array([
      ...iv,
      ...new Uint8Array(
        await crypto.subtle.encrypt(
          {
            iv,
            name: "AES-GCM",
          },
          await crypto.subtle.deriveKey(
            {
              name: "PBKDF2",
              salt,
              iterations: 100000,
              hash: "SHA-256",
            },
            await crypto.subtle.importKey(
              "raw",
              new TextEncoder().encode(key),
              {
                name: "PBKDF2",
              },
              false,
              ["deriveBits", "deriveKey"]
            ),
            {
              name: "AES-GCM",
              length: 256,
            },
            true,
            ["encrypt", "decrypt"]
          ),
          data
        )
      ),
    ]);
  },
  decrypt: async (data, key) => {
    if (data.length < 13) throw new Error();
    return new Uint8Array(
      await crypto.subtle.decrypt(
        {
          iv: data.slice(0, 12),
          name: "AES-GCM",
        },
        await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: "SHA-256",
          },
          await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(key),
            {
              name: "PBKDF2",
            },
            false,
            ["deriveBits", "deriveKey"]
          ),
          {
            name: "AES-GCM",
            length: 256,
          },
          true,
          ["encrypt", "decrypt"]
        ),
        data.slice(12)
      )
    );
  },
};
