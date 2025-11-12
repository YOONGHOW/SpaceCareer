import qs from "qs";
import { Linking } from "react-native";

type SendEmailOptions = {
  cc?: string | string[];
  bcc?: string | string[];
};

export async function SendEmail(
  to: string | string[],
  subject: string = "",
  body: string = "",
  options: SendEmailOptions = {}
) {
  const toStr = Array.isArray(to) ? to.join(",") : to;
  const ccStr = options.cc
    ? Array.isArray(options.cc)
      ? options.cc.join(",")
      : options.cc
    : undefined;
  const bccStr = options.bcc
    ? Array.isArray(options.bcc)
      ? options.bcc.join(",")
      : options.bcc
    : undefined;

  const safeBody = body.replace(/\n/g, "%0A");
  const { cc, bcc } = options;
  let mailUrl = `mailto:${to}`;
  const query = qs.stringify(
    {
      subject,
      body: safeBody,
      cc: ccStr,
      bcc: bccStr,
    },

    { skipNulls: true, encode: true }
  );

  if (query.length) {
    mailUrl += `?${query}`;
  }
  const canOpenUrl = await Linking.canOpenURL(mailUrl);
  if (!canOpenUrl) {
    throw new Error("Provided URL cannot be handled");
  }

  return Linking.openURL(mailUrl);
}
