import * as digitalocean from "@pulumi/digitalocean";

const project = (name: string) => {
  new digitalocean.Project(name, {
    description: "DigitalOcean Project for EddieHub",
    environment: "production",
    purpose: "EddieHub Community",
  });
};

export default project;
