import { colorModeInitScript } from "@/lib/color-mode";

export function ColorModeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: colorModeInitScript,
      }}
    />
  );
}
