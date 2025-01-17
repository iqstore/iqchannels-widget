const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/gim;
const phonePattern =
  /(^|\s)(\+7|8|7)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}(?=\s|$)/gim;
const urlPattern =
  /(((http|ftp|https):\/{2})+(([0-9a-z_-]+\.)+(aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mn|mo|mp|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|nom|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ra|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|yu|za|zm|zw|arpa)(:[0-9]+)?((\/([~0-9a-zA-Z#+%@.\/_-]+))?(\?[0-9a-zA-Z+%@\/&\[\];=_-]+)?)?))\b/gimsu;

export const LINK_TYPE_DEFAULT = "URL";
export const LINK_TYPE_PHONE = "PHONE";
export const LINK_TYPE_EMAIL = "EMAIL";

function makeLinkPostMessageString(value, linkType = LINK_TYPE_DEFAULT) {
  return `window.parent.postMessage({type:'iqchannels-widget-link',data:JSON.stringify({linkType:'${linkType}',value:'${value}'})}, '*');`;
}

export function linkPostMessage(value, linkType = LINK_TYPE_DEFAULT) {
    window.parent.postMessage({ type: 'iqchannels-widget-link', data: JSON.stringify({ linkType: linkType, value: value }) }, '*');
}

export function linkify(plainText) {
  let processedText = plainText;

  // Replace emails first
  processedText = processedText.replace(
    emailPattern,
    (match) => `[[[EMAIL_${match}]]]`
  );
  // Replace phone numbers next
  processedText = processedText.replace(
    phonePattern,
    (match, p1) => `${p1}[[[PHONE_${match.trim()}]]]`
  );
  // Replace URLs last
  processedText = processedText.replace(urlPattern, (match) => {
    const url = match.startsWith("http") ? match : `http://${match}`;
    return `[[[URL_${url}|${match}]]]`;
  });

  // Restore replaced texts with proper tags
  processedText = processedText.replace(
    /\[\[\[EMAIL_(.*?)]]]/g,
    (match, p1) =>
      `<a class="iqchannels-chat-link" onclick="${makeLinkPostMessageString(
        p1,
        LINK_TYPE_EMAIL
      )}return false;">${p1}</a>`
  );
  processedText = processedText.replace(
    /\[\[\[PHONE_(.*?)]]]/g,
    (match, p1) =>
      `<a class="iqchannels-chat-link" onclick="${makeLinkPostMessageString(
        p1,
        LINK_TYPE_PHONE
      )}return false;">${p1}</a>`
  );
  processedText = processedText.replace(
    /\[\[\[URL_(.*?)\|(.*?)]]]/g,
    (match, p1, p2) =>
      `<a class="iqchannels-chat-link" onclick="${makeLinkPostMessageString(p1)}return false;">${p2}</a>`
  );

  return processedText;
}
