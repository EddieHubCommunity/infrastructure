import * as digitalocean from "@pulumi/digitalocean";

const project = (name: string, resources: []) => {
  new digitalocean.Project(name, {
    description: "DigitalOcean Project for EddieHub",
    environment: "Production",
    purpose: "EddieHub Community",
    resources: resources,
  });
};

export default project;
