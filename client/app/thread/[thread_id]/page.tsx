import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Badge,
  Check,
  Eye,
  LucideEye,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { cn } from "~/lib/utils";
import React from "react";
import { Button } from "~/components/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type Props = {
  searchParams: {};
  params: {
    thread_id: string;
  };
};

export default function Page(props: Props) {
  const { thread_id } = props.params;

  if (thread_id !== "some-random-id") {
    notFound();
  }

  return (
    <div className={"px-4 flex items-center flex-1"}>
      <Card
        className={
          "flex flex-col rounded-2xl md:h-[80vh] md:aspect-[3/4] max-w-[592px]"
        }
      >
        <CardHeader className={"flex-shrink-0 p-4"}>
          <CardTitle>Threads</CardTitle>
          <p className={"text-muted-foreground text-xs"}>
            {`I'm looking for a micro blender blender to help with my tea..`}
          </p>
        </CardHeader>
        <CardContent className={"flex-1 border-y"}>
          <div className={"flex flex-col space-y-2 mt-6"}>
            <RequestItem username={"@james.walking"} isVerified={true} />
            <RequestItem username={"@resto_park"} isVerified={false} />
            <RequestItem username={"@james_walker"} isVerified={false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const RequestItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { username: string; isVerified: boolean }
>(function RequestItem(props, ref) {
  const { children, className, username, isVerified, ...PROPS } = props;

  return (
    <div
      ref={ref}
      {...PROPS}
      className={cn("flex rounded-2xl py-2 gap-x-4", className)}
    >
      <figure className={"w-12 h-12 rounded-lg bg-gray-200"}></figure>

      <div className={"flex flex-col flex-1 space-y-1"}>
        <p className={"text-base items-center space-x-2 flex"}>
          <span className={"inline-flex"}>
            {username.split("@").map((e) => {
              return e === "" ? (
                <span className={"text-muted-foreground"}>@</span>
              ) : (
                <span className={"font-medium"}>{e}</span>
              );
            })}
          </span>

          {isVerified ? (
            <ShieldCheck color={"limegreen"} size={"1em"}>
              Verified
            </ShieldCheck>
          ) : null}
        </p>
        <p className={"text-xs text-muted-foreground"}>Joined 13 days ago</p>
      </div>

      <div>
        <ViewProofModal data={{}}>
          <Button variant={"outline"} className={"rounded-xl"}>
            <Eye className={"text-muted-foreground"} size={18} />
            <span>View</span>
          </Button>
        </ViewProofModal>
      </div>
    </div>
  );
});

function ViewProofModal(props: {
  data: Record<string, any>;
  children?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogOverlay>
        <DialogContent>
          <DialogTitle className={"font-display tracking-tighter font-bold"}>
            Proof of possession
          </DialogTitle>

          <figure
            className={"flex-1 bg-gray-200 aspect-square w-full rounded-lg"}
          ></figure>

          <section className={"space-y-2"}>
            <h6
              className={
                "uppercase tracking-widest text-sm text-muted-foreground font-display"
              }
            >
              Description
            </h6>

            <p className={"text-gray-800"}>
              I have it in green, blue and yellow. If you like Lorem ipsum dolor
              sit amet, consectetur adipisicing elit. Dolor doloremque eaque
              eius exercitationem explicabo id illo nisi obcaecati sapiente ut?
              Autem beatae dolor dolorem hic nostrum officia possimus provident
              velit?
            </p>
          </section>

          <DialogFooter className={"items-end flex"}>
            <DialogTrigger asChild>
              <Button variant={"ghost"} className={"w-auto"}>
                Reject
              </Button>
            </DialogTrigger>
            <Button variant={"secondary"} className={"w-auto"}>
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
