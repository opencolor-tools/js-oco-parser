
%start expressions

%%

expressions

  : entries EOF
  {  return $1 }
  ;

entries
  : entry
  { $$ = [ $1 ]}
  | entries entry
  { $$ = $1; $1.push($2); }
  ;

entry
  : NAME ':' NEWLINE block
  { $$ = new yy.Palette($1, $4); }
  | NAME ':' colorvalue
  { $$ = new yy.Color($1, $3) }
  | metadata
  { $$ = $1; console.log("WHAT", $1) }
  ;

metadata
  : metaname ':' NAME newlines
  { $$ = new yy.Metadata($1, $3); console.log("metadata", $1, $3); }
  ;

metaname
  : '/' NAME
  { $$ = '/' + $1 }
  | NAME '/' NAME
  { $$ = $1 + '/' + $3 }
  ;

newlines
  : NEWLINE
  | NEWLINE newlines
  ;

block
  : INDENT entries OUTDENT
  { $$ = $2 }
  ;

colorvalues
  : colorvalue
  ;

hexnum
  : HEXNUMBER
  { $$ = yytext; }
  ;

colorvalue
  : '#' hexnum newlines
  { $$ = '#' + $2; }
  | '#' NUMBER newlines
  { $$ = '#' + $2; }
  ;
