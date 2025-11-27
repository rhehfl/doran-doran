"use client";

import { SsgoiTransition } from "@ssgoi/react";
import { LoginContent } from "@/app/login/_components";
import { Modal } from "@/app/_components";

export default function LoginPage() {
  return (
    <Modal>
      <SsgoiTransition id="/login">
        <LoginContent />
      </SsgoiTransition>
    </Modal>
  );
}
