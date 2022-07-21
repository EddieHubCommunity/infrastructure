import * as digitalocean from "@pulumi/digitalocean";

const cert = (kubernetesProvider) => {
  const certificate = new digitalocean.Certificate("eddiehub-cert", {
    domains: ["eddiehubcommunity.io"],
    type: "lets_encrypt",
  });

  const loadbalancer = new digitalocean.LoadBalancer(
    "eddiehub-load-balancer",
    {
      region: digitalocean.Region.LON1,
      dropletTag: "load-balancer",
      forwardingRules: [
        {
          entryPort: 443,
          entryProtocol: "https",
          targetPort: 80,
          targetProtocol: "http",
          certificateName: certificate.name,
        },
      ],
    },
    { dependsOn: [certificate], provider: kubernetesProvider }
  );

  return loadbalancer;
};

export default cert;
