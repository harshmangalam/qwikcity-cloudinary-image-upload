import { component$, Slot } from "@builder.io/qwik";

export default component$(() => {
  return (
    <main class="bg-stone-900 py-4 min-h-screen text-white">
      <Slot />
    </main>
  );
});
