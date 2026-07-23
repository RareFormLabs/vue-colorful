import { onMounted, type Ref } from "vue";
import { getNonce } from "../utils/nonce";
import styles from "../css/styles.css?inline";

type Root = Document | ShadowRoot;

const styleElementMap: WeakMap<Root, HTMLStyleElement> = new WeakMap();

export const useStyleSheet = (nodeRef: Ref<HTMLDivElement | null>): void => {
  onMounted(() => {
    const node = nodeRef.value;
    if (typeof document === "undefined" || !node) return;

    const raw = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    const root = (raw && ("head" in raw || "host" in raw) ? raw : node.ownerDocument) as Root;
    if (styleElementMap.has(root)) return;

    const target = "head" in root ? root.head : root;
    const styleElement = (target.ownerDocument || document).createElement("style");
    styleElement.innerHTML = styles;

    const nonce = getNonce();
    if (nonce) styleElement.setAttribute("nonce", nonce);

    styleElementMap.set(root, styleElement);
    target.appendChild(styleElement);
  });
};
