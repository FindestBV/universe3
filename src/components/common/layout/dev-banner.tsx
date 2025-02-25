/**
 * DevBanner Component
 *
 * This **development banner** is used to display **important system-wide notifications**.
 * Initially designed for **development alerts**, but can be extended for:
 * - **Customer-Facing Notices:** Outages, maintenance, feature releases, etc.
 * - **Feature Flags:** Toggles to enable/disable messages dynamically.
 * - **Customizable Messages:** Accepts props for dynamic content (e.g., message, severity).
 *
 * ## Features:
 * - **High Visibility:** Uses a **warning tape pattern** background.
 * - **Dynamic Messaging:** Can be repurposed for customer alerts.
 * - **Customizable Styling:** Background, colors, and animation can be modified.
 * - **Expandable:** Future updates could integrate with an **API or feature flags**.
 *
 * ## How to Extend:
 * - **Accept props** (`message`, `type`, `dismissible`) for dynamic rendering.
 * - **Integrate am api endpoint to trigger and manage alerts dynamically.
 * - **Add a close button** for dismissible notifications.
 * - **Support multiple alert levels** (info, warning, critical).
 *
 * @component
 * @example
 * <DevBanner message="System Maintenance at 2AM UTC" />
 *
 * @returns {JSX.Element} The rendered DevBanner component.
 */

export const DevBanner = () => {
  return (
    <div className="relative p-4 text-center text-xl font-black uppercase text-white sm:text-2xl">
      {/* Warning Tape Background */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#FFD700_0px,_#FFD700_10px,_black_10px,_black_20px)] opacity-100"></div>

      {/* Text Wrapper with Better Visibility */}
      <span className="relative z-10 rounded-lg bg-black/70 p-2 shadow-lg">
        ⚠️ Temporary Route for Project Landing Page ⚠️
      </span>
    </div>
  );
};

export default DevBanner;
