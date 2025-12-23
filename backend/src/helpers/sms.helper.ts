import Kavenegar from "kavenegar";

const api = Kavenegar.KavenegarApi({
  apikey:
    "645834377058767159486E716D632F4C46656D42374331545A485176362B4F554B5171387A6530595165453D",
});

export const sendSMS = (receptor: string, message: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    api.Send(
      {
        message,
        sender: "2000660110",
        receptor,
      },
      (_response: any, status: number) => {
        if (status !== 200) {
          const err = new Error("SMS sending failed");
          // @ts-ignore
          err["status"] = status;
          return reject(err);
        }
        resolve();
      }
    );
  });
};
