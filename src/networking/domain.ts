import * as digitalocean from "@pulumi/digitalocean";

const domain = (name: string, url: string) => {
  const _default = new digitalocean.Domain(
    name,
    { name: url },
    {
      retainOnDelete: true,
    }
  );

  const wildcard = new digitalocean.DnsRecord("*", {
    name: "*",
    domain: _default.id,
    type: "CNAME",
    value: `${url}.`,
  });

  return _default;
};

export default domain;
