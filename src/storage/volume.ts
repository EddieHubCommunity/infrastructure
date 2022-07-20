import { Input } from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";

const volume = (name: string, attachTo: Input<number>) => {
  const disk = new digitalocean.Volume(name, {
    region: digitalocean.Region.LON1,
    size: 30,
    initialFilesystemType: "ext4",
    description: "Kubernetes storage",
  });

  const foobarVolumeAttachment = new digitalocean.VolumeAttachment(
    `${name}VolumeAttachment`,
    {
      dropletId: attachTo,
      volumeId: disk.id,
    }
  );
};

export default volume;
