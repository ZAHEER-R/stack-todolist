export const Footer = () => {
  return (
    <div className="mt-12 space-y-4">
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-bold text-lg mb-3">Developed By</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Name:</strong> R. Zaheer</p>
          <p><strong>Regd ID:</strong> 24MIS0203</p>
          <p><strong>Department:</strong> SCORE – Computer Science Engineering and Information Systems</p>
          <p><strong>School:</strong> Vellore Institute of Technology, Vellore</p>
          <p>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:rachakula.zaheer2024@vitstudent.ac.in"
              className="text-primary hover:underline"
            >
              rachakula.zaheer2024@vitstudent.ac.in
            </a>
          </p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="font-bold text-lg mb-3">Faculty Guide</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Name:</strong> Kishore Raja P C</p>
          <p><strong>Designation:</strong> Professor Grade 1</p>
          <p><strong>School:</strong> Zaheer</p>
          <p>
            <strong>Email:</strong>{' '}
            <a
              href="mailto:kishoreraja.pc@vit.ac.in"
              className="text-primary hover:underline"
            >
              kishoreraja.pc@vit.ac.in
            </a>
          </p>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border text-center">
        <p className="text-sm text-muted-foreground">All rights reserved.</p>
      </div>
    </div>
  );
};
