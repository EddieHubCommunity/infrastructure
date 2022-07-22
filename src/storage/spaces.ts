import * as digitalocean from "@pulumi/digitalocean";

const spaces = (name: string, url: string) => {
  return new digitalocean.SpacesBucket(name, {
    region: digitalocean.Region.LON1,
    acl: "public-read",
    corsRules: [
      {
        allowedHeaders: ["*"],
        allowedMethods: ["GET"],
        allowedOrigins: ["*"],
        maxAgeSeconds: 3000,
      },
      {
        allowedHeaders: ["*"],
        allowedMethods: ["PUT", "POST", "DELETE"],
        allowedOrigins: [url],
        maxAgeSeconds: 3000,
      },
    ],
  });
};

export default spaces;
