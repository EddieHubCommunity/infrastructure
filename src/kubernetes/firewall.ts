import * as civo from "@pulumi/civo";

const firewallName = (name: string) => `${name}-fw`;

const firewall = (name) => {
  return new civo.Firewall(firewallName(name), {
    region: "lon1",
    createDefaultRules: true,
  });
};

export { firewallName, firewall };
