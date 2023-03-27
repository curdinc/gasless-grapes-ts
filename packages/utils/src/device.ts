export async function copyToClipboard({
  valueToCopy,
  onError,
  onSuccess,
}: {
  valueToCopy: string;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  try {
    if (!navigator.clipboard) {
      throw new Error("Browser don't have support for native clipboard.");
    }

    await navigator.clipboard.writeText(valueToCopy);
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error(error);
    if (onError) {
      onError();
    }
  }
}
