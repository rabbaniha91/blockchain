import React, {
  useCallback,
  useRef,
} from "react";

function WalletAddress({
  address,
  setShowAddress,
  toast,
}) {
  const notify = () =>
    toast.success("Copied", {
      position: "top-center",
    });

  const inputRef = useRef(null);
  const handleCopy = useCallback(() => {
    inputRef.current.select();
    inputRef.current.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(
      inputRef.current.value
    );
    notify();
    setTimeout(() => {
      setShowAddress(false);
    }, 5500);
  });
  return (
    <>
      <h2 style={{ fontWeight: "bold" }}>
        Your Address
      </h2>
      <textarea
        ref={inputRef}
        rows={7}
        type="text"
        readOnly
        value={address && address}
        className="address-input"
      />

      <button onClick={handleCopy}>Copy</button>
    </>
  );
}

export default WalletAddress;
