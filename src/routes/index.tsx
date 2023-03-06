import { component$, useSignal } from "@builder.io/qwik";
import {
  type DocumentHead,
  Form,
  globalAction$,
  zod$,
  z,
} from "@builder.io/qwik-city";

export const useUpload = globalAction$(
  async ({ file }) => {
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    formdata.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const endpoint =
      "https://api.cloudinary.com/v1_1/" +
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME +
      "/auto/upload";

    const res = await fetch(endpoint, {
      body: formdata,
      method: "post",
    });

    const data = await res.json();

    return {
      secureUrl: data.secure_url,
    };
  },

  zod$({
    file: z.instanceof(Blob),
  })
);
export default component$(() => {
  const fileRef = useSignal<HTMLInputElement>();
  const action = useUpload();

  return (
    <div class="max-w-md mx-auto">
      <article class="bg-stone-800 py-4 px-6  rounded-lg">
        <Form action={action} class="grid grid-cols-1 gap-4">
          <input
            accept="image/*"
            hidden
            ref={fileRef}
            type="file"
            id="file"
            name="file"
          />

          <button
            type="button"
            class="flex flex-col space-y-3 items-center border border-dashed h-80 justify-center rounded-lg"
            onClick$={() => fileRef.value?.click()}
          >
            {action.isRunning ? (
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-10 h-10 animate-spin"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </div>
            ) : (
              <>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-10 h-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>

                <span>Choose image</span>
              </>
            )}
          </button>

          <button
            class="bg-stone-700 px-4 py-2 font-medium rounded-lg w-full disabled:bg-stone-500"
            type="submit"
            disabled={action.isRunning}
          >
            {action.isRunning ? "Uploading..." : "Upload"}
          </button>
        </Form>
      </article>

      {action.value?.secureUrl && (
        <div class="my-4">
          <img
            class="w-40 h-40 aspect-square rounded-lg"
            src={action.value.secureUrl}
            alt="Preview"
          />
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "File upload | Qwikcity",
};
