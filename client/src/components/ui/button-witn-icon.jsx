import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const ButtonWithIconDemo = () => {
  return (
    <Button
      type="button"
      variant="ghost"
      className="group relative inline-flex !h-12 !w-[176px] overflow-hidden !rounded-full !bg-[#9e0819] !p-0 !text-[#111111] transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:!bg-[#e8e8e8] focus-visible:!ring-0"
    >
      <span className="absolute left-0 z-10 flex w-[128px] items-center justify-center text-sm font-medium leading-none transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-12">
        View Blogs
      </span>

      <span className="absolute right-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-[#9e0819] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-[120px] group-hover:rotate-45 font-[var(--font-primary)]">
        <ArrowUpRight size={16} />
      </span>
    </Button>
  );
};

export default ButtonWithIconDemo;
