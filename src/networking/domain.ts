import * as digitalocean from "@pulumi/digitalocean";

const domain = (name: string, url: string) =>
  new digitalocean.Domain(
    name,
    { name: url },
    {
      retainOnDelete: true,
    }
  );

export default domain;
