import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const project = (name: string, resources: pulumi.Output<string>[] = []) => {
  new digitalocean.Project(name, {
    description: "DigitalOcean Project for EddieHub",
    environment: "Production",
    purpose: "EddieHub Community",
    resources,
  });
};

export default project;
