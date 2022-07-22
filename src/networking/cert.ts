import * as digitalocean from "@pulumi/digitalocean";

const cert = (domain: digitalocean.Domain) => {
  const certificate = new digitalocean.Certificate("eddiehub-cert", {
    domains: [domain.name, domain.name.apply((d) => `*.${d}`)],
    type: "lets_encrypt",
  });

  const loadbalancer = new digitalocean.LoadBalancer("eddiehub-load-balancer", {
    region: digitalocean.Region.LON1,
    dropletTag: "load-balancer",
    redirectHttpToHttps: true,
    forwardingRules: [
      {
        entryPort: 80,
        entryProtocol: "http",
        targetPort: 80,
        targetProtocol: "http",
      },
      {
        entryPort: 443,
        entryProtocol: "https",
        targetPort: 80,
        targetProtocol: "http",
        certificateName: certificate.name,
      },
    ],
  });

  return loadbalancer;
};

export default cert;
