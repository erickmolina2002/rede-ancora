'use client'
import ContinueButton from '../ui/buttons/ContinueButton';

export default function Home() {
  return (
    <div className="">
      <h1>Bem-vindo 👋</h1>
      <ContinueButton onClick={() => alert('Continuando...')} />
    </div>
  );
}
